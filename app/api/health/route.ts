export async function GET() {
  return Response.json({ status: 'ok', message: 'GDG Jobs API ready.' });
}

// TODO: substituir por health checks reais e rotas da aplicação.
