export const errorResponse = (status: number, message: string) => {
    return new Response(JSON.stringify({ error: message }), {
        status,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}