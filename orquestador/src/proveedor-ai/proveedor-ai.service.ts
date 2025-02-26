import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class ProveedorAiService {
  readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      baseURL: this.configService.get<string>('URL_DEEPSEEK'),
      apiKey: this.configService.get<string>('DEEPSEEK_API_KEY'),
    });
  }

  async enviarPrompt(prompt: string) {
    try {
      const respuesta = await this.openai.chat.completions.create({
        model:
          this.configService.get<string>('DEEPSEEK_MODEL') ?? 'deepseek-chat',
        messages: [{ role: 'system', content: prompt }],
        temperature: 0.1,
        response_format: { type: 'json_object' },
      });

      return {
        content: respuesta.choices[0].message.content,
        usage: respuesta.usage,
      };
    } catch (error) {
      console.error('Error en el servicio de proveedor ai:', error);
      throw error;
    }
  }
}
