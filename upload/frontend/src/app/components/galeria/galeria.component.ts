import { Component, OnInit, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ArquivoService, type ArquivoListado, type RespostaListaArquivos, type RespostaUpload, type ErroUpload } from '../../services/arquivo.service';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './galeria.component.html',
  styleUrl: './galeria.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GaleriaComponent implements OnInit {
  // 📊 Signals para reatividade
  arquivos = signal<ArquivoListado[]>([]);
  carregando = signal<boolean>(false);
  enviando = signal<boolean>(false);
  mensagem = signal<string>('');
  erro = signal<string>('');
  tipoMensagem = signal<'sucesso' | 'erro' | ''>('');

  constructor(private arquivoService: ArquivoService) {
    // 📡 Effect: Escuta novos arquivos adicionados e atualiza a lista em tempo real
    effect(() => {
      this.arquivoService.novoArquivo$.subscribe((novoArquivo: ArquivoListado) => {
        const atuais = this.arquivos();
        this.arquivos.set([novoArquivo, ...atuais]); // Adiciona no início da lista
      });
    });
  }

  ngOnInit(): void {
    this.carregarArquivos();
  }

  /**
   * GET: Carrega lista de arquivos do servidor
   */
  carregarArquivos(): void {
    this.carregando.set(true);
    this.limparMensagens();

    this.arquivoService.listarArquivos().subscribe({
      next: (resposta: RespostaListaArquivos) => {
        this.arquivos.set(resposta.files);
        this.carregando.set(false);
      },
      error: (erro: any) => {
        console.error('Erro ao carregar arquivos:', erro);
        this.erro.set('Erro ao carregar os arquivos. Tente novamente.');
        this.tipoMensagem.set('erro');
        this.carregando.set(false);
      },
    });
  }

  /**
   * POST: Envia arquivo para o servidor
   * Atualiza a lista automaticamente via reatividade
   *
   * COMENTÁRIO: Após sucesso do upload, emitimos o novo arquivo via Subject
   * para atualizar a lista instantaneamente sem necessidade de F5.
   *
   * @param event - Evento do input file
   */
  onUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const arquivo = input.files?.[0];

    if (!arquivo) return;

    // ✅ Validação de tamanho no frontend (UX)
    const tamanhoMB = arquivo.size / (1024 * 1024);
    if (tamanhoMB > 5) {
      this.erro.set(
        `Arquivo muito grande (${tamanhoMB.toFixed(2)}MB). Máximo: 5MB.`
      );
      this.tipoMensagem.set('erro');
      input.value = ''; // Limpa o input
      return;
    }

    this.enviando.set(true);
    this.limparMensagens();

    this.arquivoService.enviarArquivo(arquivo).subscribe({
      next: (resposta: RespostaUpload) => {
        // ✅ Sucesso! Emite novo arquivo para reatividade
        const novoArquivo: ArquivoListado = {
          filename: resposta.filename,
          size: resposta.size,
          criado: new Date().toISOString(),
        };

        this.arquivoService.emitirNovoArquivo(novoArquivo);

        this.mensagem.set(
          `✅ ${resposta.originalname} enviado com sucesso!`
        );
        this.tipoMensagem.set('sucesso');
        this.enviando.set(false);
        input.value = ''; // Limpa o input

        // Auto-clear mensagem de sucesso após 5s
        setTimeout(() => {
          this.limparMensagens();
        }, 5000);
      },
      error: (erro: any) => {
        // ❌ Erro na requisição
        const resposta: ErroUpload = erro.error;

        if (resposta.statusCode === 413) {
          // 413 Payload Too Large
          this.erro.set(
            '❌ Arquivo muito grande! O limite máximo é 5MB.'
          );
        } else if (resposta.statusCode === 400) {
          // 400 Bad Request (tipo de arquivo inválido)
          this.erro.set(
            `❌ ${resposta.message || 'Tipo de arquivo não permitido.'}`
          );
        } else {
          this.erro.set(
            resposta.message || 'Erro ao enviar arquivo. Tente novamente.'
          );
        }

        this.tipoMensagem.set('erro');
        this.enviando.set(false);
        input.value = ''; // Limpa o input
      },
    });
  }

  /**
   * DELETE: Remove um arquivo
   * @param filename - Nome do arquivo
   */
  removerArquivo(filename: string): void {
    if (!confirm(`Tem certeza que deseja remover ${filename}?`)) return;

    this.arquivoService.removerArquivo(filename).subscribe({
      next: () => {
        // Remove da lista local
        const atualizado = this.arquivos().filter(
          (a) => a.filename !== filename
        );
        this.arquivos.set(atualizado);

        this.mensagem.set(`✅ ${filename} removido com sucesso!`);
        this.tipoMensagem.set('sucesso');

        setTimeout(() => {
          this.limparMensagens();
        }, 3000);
      },
      error: (erro: any) => {
        console.error('Erro ao remover:', erro);
        this.erro.set('Erro ao remover o arquivo.');
        this.tipoMensagem.set('erro');
      },
    });
  }

  /**
   * Formata tamanho do arquivo para formato legível
   * @param bytes - Tamanho em bytes
   * @returns String formatada (ex: "2.5 MB")
   */
  formatarTamanho(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Formata data para formato legível
   * @param data - Data ISO string
   * @returns String formatada
   */
  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Limpa mensagens de sucesso/erro
   */
  private limparMensagens(): void {
    this.mensagem.set('');
    this.erro.set('');
    this.tipoMensagem.set('');
  }

  /**
   * Tratamento quando imagem não consegue carregar
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}
