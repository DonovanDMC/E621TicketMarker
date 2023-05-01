function assert(condition: unknown, message: string): asserts condition {
    if (!condition) {
        throw new Error(message);
    }
}

async function mark(element: HTMLTableRowElement) {
    const id = Number(element.dataset.link!.slice("/tickets/".length));
    await GM.setValue("markedTickets", Array.from(new Set([...await GM.getValue("markedTickets", []), id])));
    red(element);
    unmarkButton(element, element.querySelector("td:last-child")!);
}

async function unmark(element: HTMLTableRowElement) {
    const id = Number(element.dataset.link!.slice("/tickets/".length));
    await GM.setValue("markedTickets", Array.from(new Set((await GM.getValue("markedTickets", [])).filter((x: number) => x !== id))));
    element.classList.remove("marked");
    element.style.backgroundColor = "";
    markButton(element, element.querySelector("td:last-child")!);
}

function red(element: HTMLTableRowElement) {
    element.classList.add("marked");
    element.style.backgroundColor = "#820000";
}

function markButton(row: HTMLTableRowElement, element: HTMLTableCellElement) {
    const unmarkLink = element.querySelector("a.unmark-button");
    if (unmarkLink !== null) {
        unmarkLink.remove();
    }
    if (element.querySelector("a.mark-button") !== null) {
        return;
    }
    const linkMark = document.createElement("a");
    linkMark.classList.add("mark-button");
    linkMark.addEventListener("click", async function(ev) {
        ev.preventDefault();
        await mark(row);
    });
    linkMark.textContent = "Mark";
    element.append(linkMark);
}

function unmarkButton(row: HTMLTableRowElement, element: HTMLTableCellElement) {
    const markLink = element.querySelector("a.mark-button");
    if (markLink !== null) {
        markLink.remove();
    }
    if (element.querySelector("a.unmark-button") !== null) {
        return;
    }
    const linkUnmark = document.createElement("a");
    linkUnmark.classList.add("unmark-button");
    linkUnmark.addEventListener("click", async function(ev) {
        ev.preventDefault();
        await unmark(row);
    });
    linkUnmark.textContent = "Unmark";
    element.append(linkUnmark);
}

document.addEventListener("DOMContentLoaded", async() => {
    const ticketListContainer = document.querySelector("div#c-tickets");
    assert(ticketListContainer !== null, "Could not find container");

    const ticketsHead = ticketListContainer.querySelector("thead tr");
    assert(ticketsHead !== null, "Could not find tickets head");
    const actionsHeader = document.createElement("th");
    actionsHeader.textContent = "Actions";
    ticketsHead.append(actionsHeader);

    const ticketsBody = ticketListContainer.querySelector("tbody");
    assert(ticketsBody !== null, "Could not find tickets body");

    const tickets = Array.from(ticketsBody.querySelectorAll<HTMLTableRowElement>("tr"));
    for (const row of tickets) {
        const cell = row.insertCell();
        const isMarked = (await GM.getValue("markedTickets", [] as Array<number>)).includes(Number(row.dataset.link!.slice("/tickets/".length)));
        if (isMarked) {
            red(row);
            unmarkButton(row, cell);
        } else {
            markButton(row, cell);
        }
    }
});
