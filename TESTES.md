# 🧪 Guia de Testes - Sistema de Upload e Galeria

## Pré-Requisitos
- Node.js 18+
- Backend NestJS rodando em `http://localhost:3000`
- Frontend Angular rodando em `http://localhost:4200`
- Pasta `uploads/` criada na raiz do projeto backend

---

## ✅ Testes Recomendados

### **Teste 1: Validação de 5MB (Requisito Principal)**

#### Objetivo
Verificar que arquivos > 5MB são rejeitados com HTTP 413

#### Passos
1. **Criar imagem de teste > 5MB** (exemplo: 6MB)
   ```bash
   # Windows PowerShell
   $file = New-Item -Path "C:\temp\grande.jpg" -ItemType File
   $file.Length = 6291456  # 6MB
   ```

2. **Acessar frontend**: `http://localhost:4200`

3. **Fazer upload** da imagem de 6MB

4. **Verificar resultado**:
   - ❌ Mensagem de erro aparece: "Arquivo muito grande. O limite máximo é 5MB."
   - ❌ Console mostra HTTP 413 (Payload Too Large)
   - ✅ Arquivo NÃO aparece na galeria

#### Resposta Esperada (HTTP 413)
```json
{
  "statusCode": 413,
  "message": "Arquivo muito grande. O limite máximo é 5MB.",
  "error": "Payload Too Large",
  "timestamp": "2026-05-25T10:30:45.123Z"
}
```

---

### **Teste 2: Upload Bem-Sucedido**

#### Objetivo
Verificar que imagens < 5MB são salvas e aparecem na galeria

#### Passos
1. **Preparar imagem** (< 5MB, formatos: JPG, PNG, GIF, WEBP)

2. **Acessar frontend** e fazer upload

3. **Verificar resultado**:
   - ✅ Mensagem de sucesso: "✅ nome-do-arquivo.jpg enviado com sucesso!"
   - ✅ Imagem aparece no topo da galeria (Grid responsivo)
   - ✅ **SEM ATUALIZAR A PÁGINA** (F5)
   - ✅ Informações aparecem: tamanho, data

---

### **Teste 3: Reatividade em Tempo Real**

#### Objetivo
Verificar que novo arquivo atualiza galeria sem F5

#### Passos
1. **Abrir DevTools** (F12) e ir para aba Network

2. **Fazer upload** de uma imagem

3. **Verificar**:
   - ✅ POST para `/arquivo/upload` retorna 201 ou 200
   - ✅ Imagem aparece **imediatamente** no Grid
   - ✅ Nenhum GET é feito automaticamente (reatividade via Subject)

---

### **Teste 4: Listagem de Arquivos**

#### Objetivo
Verificar que GET carrega todas as imagens do servidor

#### Passos
1. **Upload** 3-4 imagens diferentes

2. **Recarregar página** (F5)

3. **Verificar**:
   - ✅ Todas as imagens aparecem no Grid
   - ✅ Contador mostra número correto: "Suas Fotos (4)"
   - ✅ Informações estão corretas

---

### **Teste 5: Deleção de Arquivo**

#### Objetivo
Verificar que arquivo é deletado do servidor e galeria

#### Passos
1. **Na galeria**, clicar botão "Remover" de uma imagem

2. **Confirmar** na dialog

3. **Verificar**:
   - ✅ Requisição DELETE é enviada
   - ✅ Imagem desaparece da galeria
   - ✅ Mensagem de sucesso aparece
   - ✅ Arquivo foi removido do servidor

---

### **Teste 6: Validação de Tipo de Arquivo**

#### Objetivo
Verificar que apenas imagens são aceitas

#### Passos
1. **Tentar upload** de um arquivo `.txt`, `.pdf`, `.mp4`

2. **Verificar**:
   - ❌ Erro: "Apenas arquivos de imagem são permitidos (jpg, png, gif, webp)."
   - ❌ HTTP 400 (Bad Request)
   - ✅ Arquivo NÃO é salvo

---

### **Teste 7: Responsividade do Layout**

#### Objetivo
Verificar que o Grid se adapta a diferentes tamanhos

#### Passos
1. **Fazer upload** de 8+ imagens

2. **Testar tamanhos**:
   - **Mobile** (< 640px): 1 coluna
   - **Tablet** (640-1024px): 2-3 colunas
   - **Desktop** (1024-1280px): 3 colunas
   - **Large** (> 1280px): 4 colunas

3. **Verificar**: Imagens se reorganizam corretamente

---

### **Teste 8: Formatação de Dados**

#### Objetivo
Verificar que tamanho e data aparecem formatados

#### Passos
1. **Verificar card** de uma imagem

2. **Validar**:
   - Tamanho em formato legível: "2.5 MB", "512 KB", "1.2 GB"
   - Data no formato: "25/05/2026 10:30"

---

### **Teste 9: Estados de Carregamento**

#### Objetivo
Verificar que spinners aparecem nos momentos certos

#### Passos
1. **Ao abrir página**: Skeleton loaders aparecem enquanto carrega

2. **Durante upload**: Spinner aparece com "Enviando arquivo..."

3. **Clique em Atualizar**: Botão mostra spinner enquanto busca

---

### **Teste 10: Tratamento de Erros de Rede**

#### Objetivo
Verificar mensagens quando backend está offline

#### Passos
1. **Parar backend** (`Ctrl+C` no terminal NestJS)

2. **Tentar**:
   - Recarregar página
   - Fazer upload
   - Clicar "Atualizar"

3. **Verificar**:
   - ✅ Mensagens de erro amigáveis aparecem
   - ✅ Não há crashes na console

---

## 🔍 Verificações no Console (F12)

### Network Tab
```
Requisições esperadas:
✅ GET http://localhost:3000/arquivo - 200 OK (listagem)
✅ POST http://localhost:3000/arquivo/upload - 201 Created (upload)
❌ POST http://localhost:3000/arquivo/upload - 413 Payload Too Large (arquivo grande)
✅ DELETE http://localhost:3000/arquivo/delete/:filename - 200 OK (deleção)
```

### Console Tab
```
❌ Sem erros Critical ou Red (apenas avisos amarelos normais)
✅ Logs de sucesso quando arquivo é adicionado
✅ Mensagens de erro descritivas quando há problemas
```

---

## 🚀 Teste de Performance

### **Teste com Muitas Imagens**
1. **Upload** 50+ imagens
2. **Verificar**:
   - Grid carrega sem lag
   - Scroll é suave
   - Remoção é rápida
   - Sem memory leaks

### **Teste com Imagens Grandes (próximo a 5MB)**
1. **Upload** arquivo de 4.9MB
2. **Verificar**: Upload é bem-sucedido e rápido

---

## 📋 Checklist Final

- [ ] ✅ Arquivo > 5MB é rejeitado com HTTP 413
- [ ] ✅ Resposta JSON inclui mensagem clara
- [ ] ✅ Arquivo < 5MB é salvo com sucesso
- [ ] ✅ Galeria atualiza sem F5 (reatividade)
- [ ] ✅ Grid é responsivo em todos os tamanhos
- [ ] ✅ Deleção funciona corretamente
- [ ] ✅ Validação de tipo de arquivo funciona
- [ ] ✅ Formatação de tamanho e data está correta
- [ ] ✅ Estados de carregamento aparecem
- [ ] ✅ Mensagens de erro são claras
- [ ] ✅ Sem erros no console
- [ ] ✅ Layout é bonito e moderno

---

**Todos os testes passando? 🎉 Implementação está 100% pronta para produção!**
