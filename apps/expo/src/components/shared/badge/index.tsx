import { useEffect, useState } from "react"
import { Badge } from "~/components/core/badge"

export const BadgeStatus = ({status}:{status:string}) => {
    const [iconName, setIconName] = useState<string>("checkcircleo");
    const [badgeText, setBadgeText]= useState<string>("Quote Received");
    const [bg,setBg] = useState<string>("#f0f9f6");
    const [accentColor, setAccentColor] =useState<string>("#047857");
    useEffect(()=>{
        switch(status){
            case "EXPIRED":  {
            setIconName("closecircleo");
            setBadgeText("Quote expired");
            setBg("#faf1f2");
            setAccentColor("#b91c1c");
            break;
            };
            case "RECEIVED":{
            setIconName("checkcircleo");
            setBadgeText("Quote received");
            setBg("#f0f9f6")
            setAccentColor("#047857")
            break;
            };
            case "PLACED":{
            setIconName("checkcircleo");
            setBadgeText("Order placed");
            setBg("#f1f5f9")
            setAccentColor("#334155")
            break;
            };
            case "NEGOTIATION":{
            setIconName("checkcircleo");
            setBadgeText("Negotiation");
            setBg("#efebfe")
            setAccentColor("#21134e")
            break;
            };
            default: {
            setIconName("checkcircleo");
            setBadgeText("Quote Received");
            setBg("#f0f9f6")
            setAccentColor("#047857")
            break;
            }
        }
    },[status])


    return(<Badge 
        IconName={iconName}
        badgeText={badgeText}
        bg={bg}
        accentColor={accentColor}
    />
    )
}