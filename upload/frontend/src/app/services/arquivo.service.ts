import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

/**
 * Interface para tipagem do arquivo listado
 */
export interface ArquivoListado {
  filename: string;
  size: number;
  criado: string;
}

/**
 * Interface para resposta do listagem de arquivos
 */
export interface RespostaListaArquivos {
  total: number;
  files: ArquivoListado[];
}

/**
 * Interface para resposta de upload
 */
export interface RespostaUpload {
  message: string;
  filename: string;
  originalname: string;
  size: number;
}

/**
 * Interface para erro de upload
 */
export interface ErroUpload {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class ArquivoService {
  private readonly API_URL = 'http://localhost:3000/arquivo';

  // 📡 Subject para notificar quando um novo arquivo for adicionado (reatividade)
  private novoArquivoSubject = new Subject<ArquivoListado>();
  public novoArquivo$ = this.novoArquivoSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * GET: Lista todos os arquivos do servidor
   * @returns Observable com lista de arquivos
   */
  listarArquivos(): Observable<RespostaListaArquivos> {
    return this.http.get<RespostaListaArquivos>(this.API_URL);
  }

  /**
   * POST: Envia um arquivo para o servidor via FormData
   * 
   * COMENTÁRIO: Usa FormData (Multipart/Form-Data) como exigido pela API.
   * O campo deve ser nomeado 'file' conforme esperado pelo backend.
   * 
   * @param arquivo - Arquivo a ser enviado
   * @returns Observable com resposta do servidor
   */
  enviarArquivo(arquivo: File): Observable<RespostaUpload> {
    const formData = new FormData();
    formData.append('file', arquivo); // Campo esperado pela API

    return this.http.post<RespostaUpload>(`${this.API_URL}/upload`, formData);
  }

  /**
   * DELETE: Remove um arquivo do servidor
   * @param filename - Nome do arquivo a remover
   * @returns Observable com resposta do servidor
   */
  removerArquivo(filename: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/delete/${filename}`);
  }

  /**
   * Emite novo arquivo para os subscribers (atualiza a galeria em tempo real)
   * Chamado após sucesso do upload
   * @param arquivo - Arquivo que foi adicionado
   */
  emitirNovoArquivo(arquivo: ArquivoListado): void {
    this.novoArquivoSubject.next(arquivo);
  }
}
