import { createClient } from "@supabase/supabase-js";
import AsyncStorage from '@react-native-async-storage/async-storage'
import Config from "react-native-config";
export const supabase = createClient("https://kmhqfutfmvbkaxmyjdsu.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttaHFmdXRmbXZia2F4bXlqZHN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3NjY1MTUsImV4cCI6MjA1MDM0MjUxNX0.id1dmwVpwqsAFAbCNJl0tyQZbXSYLEkf6vAEl-7F8bM", {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})