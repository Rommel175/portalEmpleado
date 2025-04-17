
export default async function profilesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    return (
        <div>
            <h1>Profile con id: {id}</h1>
        </div>
    );
}