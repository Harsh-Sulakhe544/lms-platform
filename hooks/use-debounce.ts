// we dont want the user to spoil the database with his search querries again and again , so make him to stop searching for half a second 
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay?:number) : T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const timer = setTimeout(() => { 
            setDebouncedValue(value) 
        },  delay || 500 )

        // we also need to cancel timeout 
        return () => {
            clearTimeout(timer)
        }
    }, [value, delay]);

    return debouncedValue
}