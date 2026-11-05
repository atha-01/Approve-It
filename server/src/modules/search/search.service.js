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



function reconstructAbstract(invertedIndex) {
    if (!invertedIndex) {
        return "No abstract available.";
    }

    const words = [];

    for (const [word, positions] of Object.entries(invertedIndex)) {
        for (const position of positions) {
            words[position] = word;
        }
    }

    return words.filter(Boolean).join(" ");
}

// OpenAlex

export async function searchResearchPapers(query) {
    const url = new URL("https://api.openalex.org/works");

    url.searchParams.set("search", query);
    url.searchParams.set("per-page", "10");
    url.searchParams.set("sort", "relevance_score:desc");

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `OpenAlex error: ${response.status} ${response.statusText}`
        );
    }

    const result = await response.json();

    return result.results.map((paper) => ({
        id: paper.id,
        title: paper.title,
        description: reconstructAbstract(paper.abstract_inverted_index),
        authors: (paper.authorships || [])
            .slice(0, 5)
            .map((author) => author.author.display_name),
        publicationYear: paper.publication_year,
        url: paper.doi || paper.primary_location?.landing_page_url || paper.id,
        source: "OpenAlex",
        type: "research",
    }));
}


// Semantic Scholar
export async function searchSemanticScholar(query) {
    const url = new URL(
        "https://api.semanticscholar.org/graph/v1/paper/search"
    );

    url.searchParams.set("query", query);
    url.searchParams.set("limit", "10");
    url.searchParams.set(
        "fields",
        "title,abstract,authors,year,citationCount,url,openAccessPdf"
    );

    const response = await fetch(url, {
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
    throw new Error(
        `Semantic Scholar error: ${response.status} ${response.statusText}`
    );
    }

    const result = await response.json();

    return (result.data || []).map((paper) => ({
        id: paper.paperId,
        title: paper.title,
        description: paper.abstract || "No abstract available.",
        authors: (paper.authors || []).map(
            (author) => author.name
        ),
        publicationYear: paper.year,
        citations: paper.citationCount,
        url: paper.openAccessPdf?.url || paper.url,
        source: "Semantic Scholar",
        type: "research",
    }));
}



export async function searchWeb(query) {
    const apiKey = process.env.TAVILY_API_KEY;

    if (!apiKey) {
        throw new Error("Tavily API key is missing.");
    }

    const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            api_key: apiKey,
            query,
            search_depth: "basic",
            max_results: 10,
            include_answer: false,
        }),
    });

    if (!response.ok) {
        throw new Error("Unable to fetch web search results.");
    }

    const result = await response.json();

    return (result.results || []).map((item) => ({
        id: item.url,
        title: item.title,
        description: item.content,
        url: item.url,
        score: item.score,
        source: new URL(item.url).hostname,
        type: "web",
    }));
}

export async function searchGitLab(query) {
    const url = new URL("https://gitlab.com/api/v4/projects");

    url.searchParams.set("search", query);
    url.searchParams.set("order_by", "star_count");
    url.searchParams.set("sort", "desc");
    url.searchParams.set("per_page", "10");

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to fetch GitLab repositories.");
    }

    const result = await response.json();

    return result.map((project) => ({
        id: project.id,
        title: project.name_with_namespace,
        description: project.description,
        url: project.web_url,
        stars: project.star_count,
        lastUpdated: project.last_activity_at,
        source: "GitLab",
        type: "repository",
    }));
}

export async function searchCodeberg(query) {
    const url = new URL("https://codeberg.org/api/v1/repos/search");

    url.searchParams.set("q", query);
    url.searchParams.set("limit", "10");
    url.searchParams.set("sort", "stars");

    const response = await fetch(url, {
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Unable to fetch Codeberg repositories.");
    }

    const result = await response.json();

    return (result.data || []).map((repository) => ({
        id: repository.id,
        title: repository.full_name,
        description: repository.description,
        url: repository.html_url,
        stars: repository.stars_count,
        language: repository.language,
        source: "Codeberg",
        type: "repository",
    }));
}


// search for all apis together and if one fails , others should work
export async function searchAll(query) {
    const providers = [
        { name: "GitHub", search: searchGitHub },
        { name: "OpenAlex", search: searchResearchPapers },
        { name: "Semantic Scholar", search: searchSemanticScholar },
        { name: "Web", search: searchWeb },  
        { name: "GitLab", search: searchGitLab },
        { name: "Codeberg", search: searchCodeberg },
    ];



    // map starts all six searches at once and produces six promises.
    // Promise.allSettled waits for all six to finish.
    // await pauses until that report is ready and saves it in responses.


    const responses = await Promise.allSettled(
        providers.map(function (provider) {
            return provider.search(query);
        })
    );

    const results = [];
    const failedSources = [];

    // Go through each provider’s report.
    // If it succeeded, add its results to results.
    // If it failed, add its name to failedSources.
    
    responses.forEach((response, index) => {
        if (response.status === "fulfilled") {
            results.push(...response.value);
        } else {
            failedSources.push(providers[index].name);
            console.error(
        `${providers[index].name} failed:`,
        response.reason
        );
        }


        


    });

    if (results.length === 0 && failedSources.length === providers.length) {
        throw new Error("All search providers are currently unavailable.");
    }

    return {
        results,
        failedSources,
    };
}
