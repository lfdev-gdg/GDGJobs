export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return Response.json({
    message: `Detalhe da vaga ${id} será implementado em breve.`,
  });
}

// TODO: implementar rota de detalhe da vaga e regras de autorização.
