import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Loader, Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  
  // Stato per il messaggio di errore rosso
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(''); // Pulisce vecchi errori quando riprovi
    
    let error;
    
    if (isSignUp) {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      error = signUpError;
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      error = signInError;
    }

    if (error) {
      console.log("Errore Supabase:", error.message); // Utile per debug
      
      // TRADUZIONE ERRORI IN ITALIANO
      if (error.message.includes("Invalid login credentials")) {
        setErrorMsg("Email o password errata"); // <--- Ecco la scritta che volevi
      } else if (error.message.includes("User already registered")) {
        setErrorMsg("Questa email è già registrata.");
      } else if (error.message.includes("Password should be at least")) {
         setErrorMsg("La password deve avere almeno 6 caratteri.");
      } else {
        setErrorMsg("Errore: " + error.message);
      }
    } else if (isSignUp) {
      alert('Registrazione riuscita! Controlla la tua email per confermare.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 dark:bg-black transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-[#1C1C1E] rounded-[2rem] shadow-2xl p-8 animate-enter">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2 dark:text-white">
            {isSignUp ? 'Crea Account' : 'Benvenuto'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {isSignUp ? 'Inizia a gestire il tuo tempo' : 'Accedi per continuare'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          
          {/* CAMPO EMAIL */}
          <div className="space-y-1 relative">
            <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none font-medium dark:text-white"
              required
            />
          </div>

          {/* CAMPO PASSWORD */}
          <div className="space-y-1 relative">
            <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
              className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none font-medium dark:text-white"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* MESSAGGIO DI ERRORE ROSSO */}
          {errorMsg && (
            <div className="flex items-center gap-2 text-red-500 text-sm font-bold bg-red-50 dark:bg-red-900/20 p-3 rounded-xl animate-pulse">
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
            </div>
          )}

          <button
            disabled={loading}
            className="w-full py-4 bg-black text-white dark:bg-white dark:text-black rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex justify-center items-center disabled:opacity-50 disabled:scale-100"
          >
            {loading ? <Loader className="animate-spin" /> : (isSignUp ? 'Registrati' : 'Accedi')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }}
            className="text-sm font-semibold text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            {isSignUp ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati'}
          </button>
        </div>
      </div>
    </div>
  );
}