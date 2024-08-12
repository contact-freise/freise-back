import { Injectable, Logger } from '@nestjs/common';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

export const ENV = [
  'FIREBASE_API_KEY',
  'FIREBASE_APP_ID',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_MEASUREMENT_ID',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'JWT_SECRET',
  'MONGO_URI',
  'NODE_ENV',
];

@Injectable()
export class SecretManagerService {
  private readonly client = new SecretManagerServiceClient();
  private readonly logger = new Logger(SecretManagerService.name);

  async getSecret(secretId: string, versionId: string = 'latest'): Promise<string> {
    const projectId = '843883705433';
    const [version] = await this.client.accessSecretVersion({
      name: `projects/${projectId}/secrets/${secretId}/versions/${versionId}`,
    });
    return version.payload.data.toString();
  }

  async loadSecretsIntoEnv() {
    for (const secret of ENV) {
      try {
        const secretValue = await this.getSecret(secret);
        process.env[secret] = secretValue;
        this.logger.log(`Successfully set ${secret} as an environment variable`);
      } catch (error) {
        this.logger.error(`Failed to fetch or set secret ${secret}:`, error);
      }
    }
  }
}