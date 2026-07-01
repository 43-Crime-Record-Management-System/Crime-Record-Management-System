import React, { createContext, useContext, useState, useEffect } from "react";
import { FIR_API_URL, CRIMINAL_API_URL } from "../config";

const RecordsContext = createContext();

export const RecordsProvider = ({ children }) => {
    const [firs, setFirs] = useState(() => {
        try {
            const cached = localStorage.getItem("off_firs_cache");
            return cached ? JSON.parse(cached) : [];
        } catch { return []; }
    });

    const [criminals, setCriminals] = useState(() => {
        try {
            const cached = localStorage.getItem("crim_list_cache");
            return cached ? JSON.parse(cached) : [];
        } catch { return []; }
    });

    const [isLoadingFirs, setIsLoadingFirs] = useState(firs.length === 0);
    const [isLoadingCriminals, setIsLoadingCriminals] = useState(criminals.length === 0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchFirs = async () => {
        const officerId = localStorage.getItem("officerId");
        if (!officerId) return;

        try {
            const res = await fetch(`${FIR_API_URL}/officer/${officerId}`);
            const data = await res.json();
            const list = Array.isArray(data) ? data : [];
            setFirs(list);
            localStorage.setItem("off_firs_cache", JSON.stringify(list));
        } catch (err) {
            console.error("Error fetching FIRs:", err);
        } finally {
            setIsLoadingFirs(false);
        }
    };

    const fetchCriminals = async () => {
        try {
            const res = await fetch(`${CRIMINAL_API_URL}/all`);
            const data = await res.json();
            if (Array.isArray(data)) {
                const formatted = data.map((c) => ({
                    id: c.id,
                    name: c.fullName,
                    alias: c.aliases || [],
                    gender: c.gender,
                    dob: c.dateOfBirth,
                    status: c.status,
                    physical: c.physicalDescription,
                    crimes: c.crimeTypes || [],
                    mugshot: c.mugshot,
                    fingerprint: c.fingerprint,
                    linkedCases: c.linkedCases || [],
                    arrests: Array((c.arrestCount || 0)).fill(1),
                    lastUpdated: c.lastUpdated,
                    createdAt: c.createdAt,
                    dateAdded: c.dateAdded
                }));
                setCriminals(formatted);
                localStorage.setItem("crim_list_cache", JSON.stringify(formatted));
            }
        } catch (err) {
            console.error("Error fetching criminals:", err);
        } finally {
            setIsLoadingCriminals(false);
        }
    };

    const refreshAll = async () => {
        setIsRefreshing(true);
        await Promise.all([fetchFirs(), fetchCriminals()]);
        setIsRefreshing(false);
    };

    useEffect(() => {
        refreshAll();
    }, []);

    return (
        <RecordsContext.Provider value={{
    firs,
    criminals,
    setCriminals,
    isLoadingFirs,
    isLoadingCriminals,
    isRefreshing,
    refreshAll
}}>
            {children}
        </RecordsContext.Provider>
    );
};

export const useRecords = () => {
    const context = useContext(RecordsContext);
    if (!context) {
        throw new Error("useRecords must be used within a RecordsProvider");
    }
    return context;
};
