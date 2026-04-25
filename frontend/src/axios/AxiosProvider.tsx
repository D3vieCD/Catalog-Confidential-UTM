import React, { createContext, useMemo, useEffect } from "react";
import axios, { type AxiosInstance, AxiosError, type AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import paths from "../routes/paths";

export const AxiosContext = createContext<{ axiosInstance: AxiosInstance } | undefined>(undefined);

export const AxiosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();

    const axiosInstance = useMemo(() => {
        const instance = axios.create({
            baseURL: "http://localhost:5227/api",
            headers: {
                "Content-Type": "application/json",
            },
        });

        instance.interceptors.request.use((config) => {
            const token = localStorage.getItem("authToken");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        return instance;
    }, []);

    useEffect(() => {
        const responseInterceptor = axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error: AxiosError) => {
                if (error.response) {
                    switch (error.response.status) {
                        case 403:
                            navigate(paths.error.page403);
                            break;
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.response.eject(responseInterceptor);
        };
    }, [axiosInstance, navigate]);

    return (
        <AxiosContext.Provider value={{ axiosInstance }}>
            {children}
        </AxiosContext.Provider>
    );
};
