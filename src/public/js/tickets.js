const fetchTickets = async () => {
    try {
        const response = await fetch('/api/tickets');
        if (!response.ok) {
            throw new Error('No se encontraron tickets');
        }
        const tickets = await response.json();
        
        renderTickets(tickets);
    } catch (error) {
        console.error('Error al buscar los tickets:', error.message);
    }
};

const renderTickets = (tickets) => {
    const ticketsContainer = document.querySelector('#ticketsContainer');
    ticketsContainer.innerHTML = '';

    if (tickets.length === 0) {
        ticketsContainer.innerHTML = '<p>No se encontraron tickets</p>';
        return;
    }

    tickets.forEach(ticket => {
        const ticketHtml = `
            <div class="ticket">
                <p><strong>Fecha de la compra:</strong> ${new Date(ticket.purchase_datetime).toLocaleString()}</p>
                <p><strong>Total de compra:</strong> $${ticket.amount.toFixed(2)}</p>
                <p><strong>Código:</strong> ${ticket.code}</p>
                <hr />
            </div>
        `;
        ticketsContainer.insertAdjacentHTML('beforeend', ticketHtml);
    });
};

fetchTickets();