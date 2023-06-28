async function getPosts(tags: string, page = 1, previous: Array<number> = []): Promise<Array<number>> {
    const response = await fetch(`https://e621.net/posts.json?tags=${tags}&limit=320&page=${page}`, {
        method:      "GET",
        credentials: "same-origin"
    });
    const posts = (await response.json() as { posts: Array<{ id: number; }>; }).posts.map(post => post.id);
    return posts.length === 320 ? getPosts(tags, ++page, previous.concat(posts)) : previous.concat(posts);
}

document.addEventListener("DOMContentLoaded", async() => {
    const secondaryNav = document.querySelector("menu.secondary");
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.id = "add-to-set";
    a.textContent = "Bulk Add To Set";
    li.append(a);
    secondaryNav!.append(li);
    a.addEventListener("click", async() => {
        const tags = prompt("Tags to include.");
        if (tags === null) {
            alert("Invalid input for tags.");
            return;
        }

        const set = prompt("Set to add to.");
        if (set === null) {
            alert("Invalid input for set.");
            return;
        }

        let setID = Number(set);
        if (isNaN(setID) || !/^\d+$/.test(set)) {
            const search = await fetch(`https://e621.net/post_sets.json?search[shortname]=${set}`, {
                method:      "GET",
                credentials: "same-origin"
            });
            const data = await search.json() as Array<{ id: number; }>;
            if (data.length === 0) {
                alert("Set not found.");
                return;
            }
            setID = data[0].id;
        }

        console.log(tags, setID);
        const posts = await getPosts(tags);
        console.log(posts, posts.length);
        const params = new URLSearchParams();
        for (const post of posts) {
            params.append("post_ids[]", String(post));
        }

        const response = await fetch(`https://e621.net/post_sets/${setID}/add_posts`, {
            method:  "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:        params,
            credentials: "same-origin"
        });
        if (response.ok) {
            alert("Posts added successfully.");
            return;
        } else {
            alert("Something went wrong.");
            return;
        }
    });
});
