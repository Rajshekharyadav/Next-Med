import { spawn } from 'child_process';
import path from 'path';

export async function predict(imagePath: string): Promise<{
  prediction: string;
  confidence: number;
  class: string;
}> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [
      path.join(process.cwd(), 'scripts', 'skin_vision_inference.py'),
      imagePath
    ]);

    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}: ${error}`));
        return;
      }

      try {
        const prediction = JSON.parse(result);
        resolve(prediction);
      } catch (e) {
        reject(new Error(`Failed to parse prediction result: ${e}`));
      }
    });
  });
}
