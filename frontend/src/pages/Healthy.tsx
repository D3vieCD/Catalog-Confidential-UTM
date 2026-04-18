import React, { useState } from "react";
import useAxios from "../hooks/useAxios";

type HealthStatus = "idle" | "loading" | "healthy" | "unhealthy";

const statusConfig: Record<HealthStatus, { label: string; badge: string }> = {
    idle:      { label: "Not checked",          badge: "bg-gray-400" },
    loading:   { label: "Checking...",           badge: "bg-amber-400" },
    healthy:   { label: "Server is Healthy",     badge: "bg-green-500" },
    unhealthy: { label: "Server is Unhealthy",   badge: "bg-red-500" },
};

const Healthy: React.FC = () => {
    const axios = useAxios();
    const [status, setStatus] = useState<HealthStatus>("idle");
    const [detail, setDetail] = useState<string>("");

    const checkHealth = async () => {
        setStatus("loading");
        setDetail("");
        try {
            const response = await axios.get("/health");
            setStatus("healthy");
            setDetail(typeof response.data === "string" ? response.data : JSON.stringify(response.data));
        } catch (err: any) {
            setStatus("unhealthy");
            setDetail(err?.message ?? "Unknown error");
        }
    };

    const { label, badge } = statusConfig[status];

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center gap-6 w-80">
                <h1 className="text-xl font-bold text-gray-800">Server Health Check</h1>

                <span className={`${badge} text-white font-semibold text-sm px-6 py-2 rounded-full`}>
                    {label}
                </span>

                {detail && (
                    <p className="text-xs text-gray-500 text-center break-all">{detail}</p>
                )}

                <button
                    onClick={checkHealth}
                    disabled={status === "loading"}
                    className="bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-semibold text-sm px-8 py-3 rounded-lg transition-colors w-full"
                >
                    {status === "loading" ? "Checking..." : "Check Health"}
                </button>
            </div>
        </div>
    );
};

export default Healthy;
