
import prisma from "../../config/prisma.ts";

export async function searchGitHub(query) {
    const url = new URL("https://api.github.com/search/repositories");

    url.searchParams.set("q", query);
    url.searchParams.set("sort", "stars");
    url.searchParams.set("order", "desc");
    url.searchParams.set("per_page", "10");

    const response = await fetch(url, {
        headers: {
            Accept: "application/vnd.github+json",
        },
    });

    if (!response.ok) {
        throw new Error("Unable to fetch GitHub repositories.");
    }

    const result = await response.json();

    return result.items.map((repository) => ({
        id: repository.id,
        title: repository.full_name,
        description: repository.description,
        url: repository.html_url,
        language: repository.language,
        stars: repository.stargazers_count,
        source: "GitHub",
        type: "repository",
    }));
}
