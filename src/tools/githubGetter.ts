//base data
const USER = "NateTheGrappler";
const headers = {
  Authorization: `Bearer ${import.meta.env.GITHUB_TOKEN}`,
  "User-Agent": "natan-portfolio",
  Accept: "application/vnd.github+json", };

//Get recent commits from profile with GraphQL
const RECENT_COMMITS = `
  query {
    viewer {
      repositories(first: 5, orderBy: { field: PUSHED_AT, direction: DESC }, privacy: PUBLIC) {
        nodes {
          name
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 3) {
                  nodes {
                    messageHeadline
                    url
                    committedDate
                    additions
                    deletions
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
const PROFILE_LANGUAGES =
`
query {
  viewer {
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
      nodes {
        name
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
          edges {
            size
            node { name color }
          }
        }
      }
    }
  }
}`;
let profilePromise: Promise<any> | null = null;

//check if the token is good or not
if(!import.meta.env.GITHUB_TOKEN)
{
    console.log("Your token got messed up somehow for github");
}

//the standard fetch function
async function getGithubData(path: string)
{
    try
    {
        const response = await fetch(`https://api.github.com${path}`, {headers});
        if(!response.ok)
        {
            console.error(`GitHub REST ${response.status} for ${path}`);
            return null;
        }
        return await response.json();
    }
    catch(error)
    {
        console.error(`GitHub REST fetch failed for ${path}:`, error);
        return null;
    }
}

async function getGithubQLData(query: string, variables: Record<string, unknown> = {}) 
{
    try
    {
        //make post request to the github api endpoint
        const response = await fetch("https://api.github.com/graphql" , {
            method: "POST",
            headers,
            body: JSON.stringify({query, variables})
        })

        //null check
        if(!response.ok)
        {
            console.error(`GitHub GraphQL HTTP ${response.status}`);
            return null;
        }

        //try conversion to json for better reading, if good then return data
         const json = await response.json();
        if (json.errors) 
        {
            console.error("GitHub GraphQL errors:", json.errors);
            return null;
        }
        return json.data;
    }
    catch (error)
    {
        console.error("GitHub GraphQL fetch failed:", error);
        return null;
    }
}

//the REST functions for getting data per each repository in a given project
export const getRepo = (repo: string)           =>  getGithubData(`/repos/${USER}/${repo}`);
export const getLanguages = (repo: string)      => getGithubData(`/repos/${USER}/${repo}/languages`);
export const getCommits = (repo: string, n = 5) => getGithubData(`/repos/${USER}/${repo}/commits?per_page=${n}`);
export const getStarCount = (repo: string)      => getGithubData(`/repos/${USER}/${repo}/stargazers/count`);
export const getContibutors = (repo: string)    => getGithubData(`/repos/${USER}/${repo}/contributors`);



//functions for GraphQL data for the actual homepage/index of the portfolio
interface CommitItem 
{
  repo: string;
  message: string;
  url: string;
  date: string;
  additions: number;
  deletions: number;
}

export async function recentCommits(amount: number): Promise<CommitItem[]>
{
  const profileData = await getGithubQLData(RECENT_COMMITS, {});

  const repos = profileData?.viewer?.repositories.nodes ?? [];
  const commits: CommitItem[] = [];

  //loop over the repos and then get the commit for each and then the data for each commit
  for(const repo of repos)
  {
    const repoCommits = repo.defaultBranchRef?.target?.history?.nodes ?? [];

    for(const commit of repoCommits)
    {
      commits.push(
        {
          repo: repo.name,
          message: commit.messageHeadline,
          url: commit.url,
          date: commit.committedDate,
          additions: commit.additions,
          deletions: commit.deletions
        }
      )
    }
  }

  //sort all of the data from newest to oldest
  commits.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  //return the first 5 only
  return commits.slice(0, amount);
}

export async function profileLanguages()
{
    const profileData = await getGithubQLData(PROFILE_LANGUAGES, {});

    const repos = profileData?.viewer?.repositories.nodes ?? [];

    //store languages
    const totals = new Map<string, { bytes: number; color: string }>();
    let totalBytes = 0;

    for(const repo of repos)
    {
      for(const edge of repo.languages.edges)
      {
        const { name, color } = edge.node;
        const entry = totals.get(name) ?? { bytes: 0, color: color ?? "#888" };
        entry.bytes += edge.size;
        totals.set(name, entry);
        totalBytes += edge.size;
      }
    }

    const languages = [...totals]
    .map(([name, { bytes, color }]) => ({ name, color, percent: (bytes / totalBytes) * 100 }))
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 6);

    return languages;

}
