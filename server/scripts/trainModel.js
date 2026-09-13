import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractFeatures, FEATURE_NAMES } from '../src/services/mlFeatureExtractor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.join(__dirname, '..', 'data', 'phishing_dataset.json');
const modelOutputPath = path.join(__dirname, '..', 'src', 'models', 'trained_model.json');

console.log('=====================================================');
console.log('   PHISHGUARD AI — MACHINE LEARNING MODEL TRAINING   ');
console.log('=====================================================\n');

if (!fs.existsSync(datasetPath)) {
  console.error(`Dataset not found at: ${datasetPath}`);
  console.error('Please run "node scripts/generateDataset.js" first.');
  process.exit(1);
}

const rawDataset = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));
console.log(`Loaded dataset with ${rawDataset.length} labeled samples.`);

// 1. Vectorize all URLs into 32-D numeric feature vectors
console.log('Vectorizing URL samples into 32-D feature space...');
const X_all = [];
const y_all = [];

for (let i = 0; i < rawDataset.length; i++) {
  const item = rawDataset[i];
  const feat = extractFeatures(item.url);
  X_all.push(feat);
  y_all.push(item.label);
}

const numSamples = X_all.length;
const numFeatures = FEATURE_NAMES.length;

// 2. Train / Test Split (80% Train, 20% Test)
const trainRatio = 0.80;
const splitIndex = Math.floor(numSamples * trainRatio);

const X_train = X_all.slice(0, splitIndex);
const y_train = y_all.slice(0, splitIndex);

const X_test = X_all.slice(splitIndex);
const y_test = y_all.slice(splitIndex);

console.log(`Split dataset: ${X_train.length} training samples, ${X_test.length} test validation samples.`);

// 3. Compute StandardScaler parameters from training set ONLY
console.log('Fitting StandardScaler on training data...');
const means = new Array(numFeatures).fill(0);
const stds = new Array(numFeatures).fill(0);

for (let j = 0; j < numFeatures; j++) {
  let sum = 0;
  for (let i = 0; i < X_train.length; i++) {
    sum += X_train[i][j];
  }
  means[j] = sum / X_train.length;

  let sqDiffSum = 0;
  for (let i = 0; i < X_train.length; i++) {
    const diff = X_train[i][j] - means[j];
    sqDiffSum += diff * diff;
  }
  // Avoid division by zero with small epsilon
  stds[j] = Math.sqrt(sqDiffSum / X_train.length) + 1e-7;
}

// Function to standardize a feature vector
function standardize(vec) {
  const norm = new Array(numFeatures);
  for (let j = 0; j < numFeatures; j++) {
    norm[j] = (vec[j] - means[j]) / stds[j];
  }
  return norm;
}

// Standardize training and test matrices
const X_train_norm = X_train.map(standardize);
const X_test_norm = X_test.map(standardize);

// Sigmoid activation function
function sigmoid(z) {
  if (z > 30) return 1.0;
  if (z < -30) return 0.0;
  return 1.0 / (1.0 + Math.exp(-z));
}

// 4. Model Training via Mini-Batch Gradient Descent with Momentum and L2 Regularization
console.log('\nTraining Logistic Classification Model...');
const weights = new Array(numFeatures).fill(0);
let bias = 0;

const v_w = new Array(numFeatures).fill(0);
let v_b = 0;

const epochs = 220;
const batchSize = 64;
const learningRate = 0.04;
const momentum = 0.9;
const lambdaL2 = 0.0005; // L2 Weight Decay to prevent overfitting

const numBatches = Math.ceil(X_train_norm.length / batchSize);

for (let epoch = 1; epoch <= epochs; epoch++) {
  // Mini-batch SGD
  for (let b = 0; b < numBatches; b++) {
    const startIdx = b * batchSize;
    const endIdx = Math.min(startIdx + batchSize, X_train_norm.length);
    const currentBatchSize = endIdx - startIdx;

    const grad_w = new Array(numFeatures).fill(0);
    let grad_b = 0;

    for (let i = startIdx; i < endIdx; i++) {
      const xi = X_train_norm[i];
      const yi = y_train[i];

      let logit = bias;
      for (let j = 0; j < numFeatures; j++) {
        logit += weights[j] * xi[j];
      }

      const p = sigmoid(logit);
      const error = p - yi;

      for (let j = 0; j < numFeatures; j++) {
        grad_w[j] += error * xi[j];
      }
      grad_b += error;
    }

    // Apply batch average + L2 regularization gradient
    for (let j = 0; j < numFeatures; j++) {
      const avgGrad = (grad_w[j] / currentBatchSize) + lambdaL2 * weights[j];
      v_w[j] = momentum * v_w[j] + learningRate * avgGrad;
      weights[j] -= v_w[j];
    }

    const avgGradB = grad_b / currentBatchSize;
    v_b = momentum * v_b + learningRate * avgGradB;
    bias -= v_b;
  }

  // Periodic progress update
  if (epoch % 40 === 0 || epoch === epochs) {
    // Quick train loss calculation
    let trainLoss = 0;
    for (let i = 0; i < 500; i++) {
      let logit = bias;
      for (let j = 0; j < numFeatures; j++) logit += weights[j] * X_train_norm[i][j];
      const p = Math.max(1e-12, Math.min(1 - 1e-12, sigmoid(logit)));
      const yi = y_train[i];
      trainLoss += -(yi * Math.log(p) + (1 - yi) * Math.log(1 - p));
    }
    trainLoss /= 500;
    console.log(`Epoch ${epoch.toString().padStart(3)} / ${epochs} | Loss: ${trainLoss.toFixed(5)}`);
  }
}

// 5. Model Evaluation on Held-Out Validation Test Set
console.log('\nEvaluating trained model on held-out validation test set...');

let tp = 0;
let fp = 0;
let tn = 0;
let fn = 0;

for (let i = 0; i < X_test_norm.length; i++) {
  const xi = X_test_norm[i];
  const actual = y_test[i];

  let logit = bias;
  for (let j = 0; j < numFeatures; j++) {
    logit += weights[j] * xi[j];
  }
  const prob = sigmoid(logit);
  const predicted = prob >= 0.5 ? 1 : 0;

  if (actual === 1 && predicted === 1) tp++;
  else if (actual === 0 && predicted === 1) fp++;
  else if (actual === 0 && predicted === 0) tn++;
  else if (actual === 1 && predicted === 0) fn++;
}

const totalTest = X_test_norm.length;
const accuracy = (tp + tn) / totalTest;
const precision = tp / (tp + fp || 1);
const recall = tp / (tp + fn || 1);
const f1Score = (2 * precision * recall) / (precision + recall || 1);

console.log('-----------------------------------------------------');
console.log('                 TEST SET METRICS                    ');
console.log('-----------------------------------------------------');
console.log(`Total Test Samples : ${totalTest}`);
console.log(`True Positives (TP): ${tp}`);
console.log(`False Positives (FP): ${fp}`);
console.log(`True Negatives (TN): ${tn}`);
console.log(`False Negatives (FN): ${fn}`);
console.log(`Accuracy           : ${(accuracy * 100).toFixed(2)}%`);
console.log(`Precision          : ${(precision * 100).toFixed(2)}%`);
console.log(`Recall             : ${(recall * 100).toFixed(2)}%`);
console.log(`F1-Score           : ${f1Score.toFixed(4)}`);
console.log('-----------------------------------------------------\n');

// 6. Inspect Top Influential Learned Features
const featureImportance = FEATURE_NAMES.map((name, idx) => ({
  name,
  weight: weights[idx],
  absWeight: Math.abs(weights[idx])
})).sort((a, b) => b.absWeight - a.absWeight);

console.log('Top 10 Most Influential Learned Features:');
featureImportance.slice(0, 10).forEach((f, idx) => {
  const direction = f.weight > 0 ? '+ Phishing Risk' : '- Legitimate Signal';
  console.log(` ${idx + 1}. ${f.name.padEnd(26)} | Weight: ${f.weight.toFixed(4).padStart(8)} (${direction})`);
});

// 7. Save Model Weights & Parameters
const modelArtifact = {
  architecture: 'LogisticRegression_L2_SGD',
  trainedAt: new Date().toISOString(),
  datasetSamples: numSamples,
  trainSamples: X_train.length,
  testSamples: X_test.length,
  metrics: {
    accuracy: Number(accuracy.toFixed(4)),
    precision: Number(precision.toFixed(4)),
    recall: Number(recall.toFixed(4)),
    f1Score: Number(f1Score.toFixed(4)),
    confusionMatrix: { tp, fp, tn, fn }
  },
  featureNames: FEATURE_NAMES,
  scaler: {
    means: means.map(m => Number(m.toFixed(6))),
    stds: stds.map(s => Number(s.toFixed(6)))
  },
  weights: weights.map(w => Number(w.toFixed(6))),
  bias: Number(bias.toFixed(6))
};

// Ensure destination folder exists
const modelDir = path.dirname(modelOutputPath);
if (!fs.existsSync(modelDir)) {
  fs.mkdirSync(modelDir, { recursive: true });
}

fs.writeFileSync(modelOutputPath, JSON.stringify(modelArtifact, null, 2), 'utf-8');
console.log(`\nTrained ML model successfully saved to:\n${modelOutputPath}`);
