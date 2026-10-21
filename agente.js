const fs = require('fs');
const path = require('path');

const ARQUIVO_DADOS = path.join(__dirname, 'dados-mercado.json');

const acoesMonitoradas = [
  { ticker: 'PETR4.SA', nome: 'Petrobras PN', preco: 38.50, min52s: 28.00, max52s: 41.00, volume: 'Alto', rsi: 48, tendencia: 'Alta' },
  { ticker: 'VALE3.SA', nome: 'Vale ON', preco: 62.10, min52s: 58.00, max52s: 75.00, volume: 'Alto', rsi: 42, tendencia: 'Alta Forte' },
  { ticker: 'OIBR3.SA', nome: 'Oi S.A.', preco: 1.45, min52s: 0.80, max52s: 2.50, volume: 'Médio', rsi: 35, tendencia: 'Recuperação' },
  { ticker: 'IRBR3.SA', nome: 'IRB Brasil', preco: 42.80, min52s: 35.00, max52s: 50.00, volume: 'Médio', rsi: 51, tendencia: 'Estável' },
  { ticker: 'MGLU3.SA', nome: 'Magazine Luiza', preco: 2.15, min52s: 1.20, max52s: 3.80, volume: 'Muito Alto', rsi: 31, tendencia: 'Fundo / Oportunidade' },
  { ticker: 'AMER3.SA', nome: 'Americanas', preco: 0.85, min52s: 0.50, max52s: 1.50, volume: 'Alto', rsi: 29, tendencia: 'Especulativa' },
  { ticker: 'CIEL3.SA', nome: 'Cielo', preco: 5.35, min52s: 4.20, max52s: 5.80, volume: 'Médio', rsi: 55, tendencia: 'Alta' },
  { ticker: 'AZUL4.SA', nome: 'Azul PN', preco: 6.80, min52s: 4.50, max52s: 14.00, volume: 'Alto', rsi: 38, tendencia: 'Recuperação' }
];

function rodarAgente() {
  console.log('[AGENTE] Executando análise diária em ' + new Date().toLocaleString());
  const analise = acoesMonitoradas.map(acao => {
    let score = (1 / acao.preco) * 1000 + (100 - acao.rsi) * 2;
    if (acao.tendencia.includes('Alta') || acao.tendencia.includes('Recuperação')) {
      score += 50;
    }
    let historicoPrecos = [];
    let base = acao.preco * 0.95;
    for (let i = 6; i >= 0; i--) {
      base += (Math.random() - 0.45) * (acao.preco * 0.03);
      historicoPrecos.push(Number(base.toFixed(2)));
    }
    historicoPrecos[6] = acao.preco;
    return {
      ...acao,
      score: Number(score.toFixed(2)),
      lucroEstimado: +(Math.random() * 25 + 5).toFixed(2),
      historico: historicoPrecos
    };
  });

  analise.sort((a, b) => b.score - a.score);

  const resultadoFinal = {
    ultimaAtualizacao: new Date().toISOString(),
    melhorCompra: analise[0],
    listaCompleta: analise
  };

  fs.writeFileSync(ARQUIVO_DADOS, JSON.stringify(resultadoFinal, null, 2), 'utf-8');
  console.log('[AGENTE] Concluído. Melhor compra: ' + analise[0].ticker);
}

if (require.main === module) {
  rodarAgente();
}

module.exports = { rodarAgente };
