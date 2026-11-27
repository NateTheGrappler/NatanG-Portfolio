//have a fetch for both the total number of clicks that the button has as well
//as the total number from a single user with their ID


//MAKE THESE PERMANENT BECAUSE I JUST SPENT 3 HOURS DEBUGGING A DAMN TYPO I HATE THIS SO MUCH HOLY CRAP
const USER_ID_KEY = "clickUserId";

interface ButtonCounts
{
    total: number,
    mine: number
}

//helper function for getting the USER ID for the unique button count
function getUserID(): string {
    let id = localStorage.getItem(USER_ID_KEY);

    //create one if there does not exist one
    if(!id)
    {
        id = crypto.randomUUID();
        localStorage.setItem(USER_ID_KEY, id);
    }

    return id;
}

//fetch the counts only, simple get request for rendering the data
export async function getButtonCount(): Promise<ButtonCounts>
{
    const user = encodeURIComponent(getUserID());
    const repsonse = await fetch(`https://portfolio-worker.guzinskinatan.workers.dev/clicks?user=${user}`);
    const buttonData = await repsonse.json();

    return buttonData;
}

export async function updateButtonCount(): Promise<ButtonCounts>
{
    //hit the post request
    const user = encodeURIComponent(getUserID());

    //send the post request and let the backend worker update the sql table value with the value = value + 1;
    const response = await fetch(`https://portfolio-worker.guzinskinatan.workers.dev/clicks?user=${user}`, {
        method: 'POST'
    })
    const buttonData = await response.json();

    return buttonData;
}