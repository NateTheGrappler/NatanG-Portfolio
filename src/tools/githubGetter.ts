//base data
const USER = "NateTheGrappler";
const headers = {
  Authorization: `Bearer ${import.meta.env.GITHUB_TOKEN}`,
  "User-Agent": "natan-portfolio",
  Accept: "application/vnd.github+json", };

//define the data that I query for from the githubQL api
const PROFILE_QUERY = `
  query($login: String!) {
    user(login: $login) {
      repositories(first: 100, ownerAffiliations: OWNER, isFork: false, orderBy: {field: PUSHED_AT, direction: DESC}) {
        totalCount
        nodes {
          name
          description
          url
          stargazerCount
          pushedAt
          languages(first: 10) {
            edges { size node { name color } }
          }
        }
      }
      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount } }
        }
      }
    }
  }
`;
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
export const getActivity = ()                   =>  getGithubData(`/users/${USER}/events/public`);


//functions for GraphQL data for the actual homepage/index of the portfolio
export function getProfile() 
{
    //only assign the data if its still null so you don't waste queries to github
    profilePromise ??= getGithubQLData(PROFILE_QUERY, { login: USER });
    return profilePromise;
}