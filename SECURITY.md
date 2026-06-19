# Política de Segurança

## Versões Suportadas

| Versão | Suportado |
| ------ | --------- |
| 22.x   | ✅        |
| < 22   | ❌        |

## Reportar Vulnerabilidades

**Por favor, NÃO reporte vulnerabilidades através de issues públicas.**

Em vez disso, envie um email para o mantenedor do projeto com:

- Descrição do vulnerability
- Passos para reproduzir
- Impacto potencial
- Sugestão de fix (se disponível)

## Resposta

- **Confirmação**: Até 48 horas
- **Status do fix**: Até 7 dias
- **Publicação**: Após o fix estar disponível

## Práticas de Segurança

Este projeto segue estas práticas:

- Dependências auditadas via `npm audit`
- TypeScript strict mode (`strict: true`)
- `verbatimModuleSyntax` para imports seguros
- Nenhum segredo no repositório
- Environment variables para configuração sensível
- HTTPS em produção
- CSP headers recomendados para deploy
- Husky hooks para prevenir commits acidentais
- lint-staged para validação pré-commit
- Knip para detectar código morto e dependências não usadas

## Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] HTTPS habilitado
- [ ] CSP headers configurados
- [ ] Rate limiting ativo
- [ ] CORS configurado corretamente
- [ ] Logs de auditoria habilitados
- [ ] `npm run security:check` sem vulnerabilidades críticas
