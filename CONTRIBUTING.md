# Contribuindo para o Agentwork

Obrigado por considerar contribuir com o Agentwork!

## Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Setup de Desenvolvimento](#setup-de-desenvolvimento)
- [Convenções de Commit](#convenções-de-commit)
- [Estilo de Código](#estilo-de-código)
- [Pull Requests](#pull-requests)
- [Issues](#issues)

## Código de Conduta

Este projeto adere ao [Código de Conduta](CODE_OF_CONDUCT.md). Ao contribuir, você concorda em seguir suas diretrizes.

## Como Contribuir

### Reportar Bugs

1. Verifique se o bug já foi reportado em [Issues](https://github.com/mmdj04/Agentwork/issues)
2. Se não existir, abra uma nova issue com:
   - Título descritivo
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)
   - Ambiente (SO, navegador, versão do Node)

### Sugerir Funcionalidades

1. Verifique issues existentes
2. Abra uma issue com a tag `enhancement`
3. Descreva:
   - Problema que resolve
   - Solução proposta
   - Alternativas consideradas

### Enviar Code Changes

1. Fork o repositório
2. Crie uma branch (`git checkout -b feat/minha-feature`)
3. Faça suas alterações
4. Adicione testes se aplicável
5. Execute `npm run lint` e `npm run test`
6. Commit seguindo as convenções
7. Push e abra um Pull Request

## Setup de Desenvolvimento

### Pré-requisitos

- Node.js >= 22.0.0
- npm >= 11.17.0

### Instalação

```bash
# Fork e clone
git clone https://github.com/SEU_USUARIO/Agentwork.git
cd Agentwork

# Instale dependências
npm install

# Execute os testes
npm run test

# Inicie o servidor dev
npm start
```

### Comandos Úteis

```bash
npm run lint          # Verificar lint
npm run lint:fix      # Corrigir lint
npm run format        # Formatar código
npm run format:check  # Verificar formatação
npm run typecheck     # Verificar tipos
npm run knip          # Detectar código morto
npm run test:coverage # Coverage HTML
```

## Convenções de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/pt-BR/):

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[footer opcional]
```

### Tipos

| Tipo       | Descrição                     |
| ---------- | ----------------------------- |
| `feat`     | Nova funcionalidade           |
| `fix`      | Correção de bug               |
| `docs`     | Documentação                  |
| `style`    | Formatação (não afeta lógica) |
| `refactor` | Refatoração                   |
| `test`     | Testes                        |
| `chore`    | Manutenção                    |
| `ci`       | CI/CD                         |
| `perf`     | Performance                   |
| `build`    | Build system                  |

### Exemplos

```bash
git commit -m "feat(auth): add login component"
git commit -m "fix(api): handle null response"
git commit -m "docs: update README"
git commit -m "test: add unit tests for UserService"
```

## Estilo de Código

### TypeScript

- `strict: true` habilitado
- Usar `import type` para imports de tipo
- Seguir padrões Angular (signals, standalone components)
- Nomes: `camelCase` para variáveis/funções, `PascalCase` para classes/componentes

### HTML

- Usar sintaxe Angular moderna (`@if`, `@for`, `@defer`)
- Componentes como elementos (`app-minha-tela`)
- Diretivas como atributos (`appMinhaDiretiva`)

### CSS

- Tailwind CSS para estilização
- CSS layers para cascade management
- Evitar `!important`

## Pull Requests

### Título

Seguir convenções de commit:

```
feat(auth): add login page
fix(api): handle timeout error
```

### Descrição

```markdown
## Descrição

Breve descrição das mudanças

## Tipo de Mudança

- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação
- [ ] Refatoração

## Como Testar

1. Passo 1
2. Passo 2
3. Passo 3

## Screenshots (se aplicável)
```

### Checklist

- [ ] Código segue o estilo do projeto
- [ ] Testes foram adicionados/atualizados
- [ ] `npm run lint` passa
- [ ] `npm run test` passa
- [ ] `npm run format:check` passa
- [ ] Documentação foi atualizada (se necessário)
- [ ] Commits seguem as convenções

## Issues

### Labels

| Label              | Descrição           |
| ------------------ | ------------------- |
| `bug`              | Bug report          |
| `enhancement`      | Nova funcionalidade |
| `documentation`    | Documentação        |
| `good first issue` | Bom para iniciantes |
| `help wanted`      | Ajuda necessária    |
| `question`         | Pergunta            |

### Template de Issue

```markdown
## Descrição

Descrição do problema/funcionalidade

## Passos para Reproduzir

1. ...
2. ...

## Comportamento Esperado

...

## Screenshots

...

## Ambiente

- SO:
- Navegador:
- Node.js:
- npm:
```

## Perguntas?

Em caso de dúvidas, abra uma issue com a tag `question`.
