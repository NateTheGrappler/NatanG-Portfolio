export async function checkHomelabStatus()
{
    try
    {
        const response = await fetch(`https://portfolio-worker.guzinskinatan.workers.dev/status`, 
            {
                signal: AbortSignal.timeout(5000), //wait 5 sec for connection
            }
        );

        if(!response.ok)
        {
            console.log("Failure with reaching cloudflare's worker endpoint");
            return null;
        }
        
        const data = await response.json();
        return data;
    }
    catch (error)
    {
        //whatever error happens, return offline
        console.log("Failure with reaching cloudflare's worker endpoint");
        return null;
    }
}