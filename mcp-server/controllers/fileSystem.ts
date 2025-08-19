// node-mcp-server/controllers/filesystem.ts
import { spawn } from 'child_process';

export class FileSystemController {
  private userPath: string;

  constructor(userPath: string) {
    this.userPath = userPath;
  }

  private runMCP(args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const proc = spawn('npx', ['-y', '@modelcontextprotocol/server-filesystem', ...args]);

      let output = '';
      proc.stdout.on('data', (data) => (output += data.toString()));
      proc.stderr.on('data', (data) => console.error(`[filesystem MCP ERROR] ${data}`));
      proc.on('close', (code) => {
        if (code === 0) resolve(output.trim());
        else reject(new Error(`MCP exited with code ${code}`));
      });
    });
  }

  async listFiles(dirPath: string = this.userPath) {
    return this.runMCP([dirPath, 'list']);
  }

  async readFile(filePath: string) {
    return this.runMCP([filePath, 'read']);
  }

  async writeFile(filePath: string, content: string) {
    return this.runMCP([filePath, 'write', content]);
  }

  async deleteFile(filePath: string) {
    return this.runMCP([filePath, 'delete']);
  }

  async createDirectory(dirPath: string) {
    return this.runMCP([dirPath, 'mkdir']);
  }

  async deleteDirectory(dirPath: string) {
    return this.runMCP([dirPath, 'rmdir']);
  }

  async moveFile(srcPath: string, destPath: string) {
    return this.runMCP([srcPath, 'move', destPath]);
  }

  async copyFile(srcPath: string, destPath: string) {
    return this.runMCP([srcPath, 'copy', destPath]);
  }

  async renameFile(srcPath: string, newName: string) {
    return this.runMCP([srcPath, 'rename', newName]);
  }

  async getStats(filePath: string) {
    return this.runMCP([filePath, 'stats']);
  }

  async searchFiles(dirPath: string, pattern: string) {
    return this.runMCP([dirPath, 'search', pattern]);
  }

  async watchDirectory(dirPath: string, callback?: (event: string) => void) {
    const proc = spawn('npx', ['-y', '@modelcontextprotocol/server-filesystem', dirPath, 'watch']);
    
    proc.stdout.on('data', (data) => {
      const msg = data.toString().trim();
      if (callback) callback(msg);
      console.log(`[watchDirectory] ${msg}`);
    });

    proc.stderr.on('data', (data) => console.error(`[watchDirectory ERROR] ${data}`));

    proc.on('close', (code) => {
      console.log(`[watchDirectory] exited with code ${code}`);
    });

    return proc; // 종료 시 프로세스 종료 필요
  }

  async readBinaryFile(filePath: string) {
    return this.runMCP([filePath, 'read-binary']);
  }
}
