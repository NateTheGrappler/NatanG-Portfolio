export async function checkHomelabStatus()
{
    try
    {
        const response = await fetch(`https://status.midascloud.net/health`, 
            {
                signal: AbortSignal.timeout(5000), //wait 5 sec for connection
            }
        );
        //online return online
        return response.ok;;
    }
    catch (error)
    {
        //whatever error happens, return offline
        return false;
    }
}