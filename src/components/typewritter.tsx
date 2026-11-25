import { useEffect, useState } from "react";
import "../styles/typewritter.css"

export default function TypeWritter({text, speed}: {text: string, speed?: number})
{
    const [shown, setShown] = useState("");
    const [renderCursor, setRenderCursor] = useState(true);

    useEffect(() => 
    {
        let i = 0;
        const id = setInterval(() => 
        {
            i++;
            setShown(text.slice(0, i));

            if(i >= text.length) 
            {
                clearInterval(id);
                setRenderCursor(false);
            }
        }, speed)

        return () => clearInterval(id)
    }, [text, speed])


    return (    
        <span className="text">{shown}
            <span className={renderCursor ? "cursor" : "hideCursor"}>▏</span>
        </span>
    )

}