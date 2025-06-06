import { useState, useEffect } from 'react';
import { fetchData } from '@/services/mysql/functions';
import { INoticias } from '@/shared/types/Querys/INoticias';

interface UseNoticiasResult {
  noticias: INoticias[];
  loading: boolean;
  error: string | null;
  totalPages?: number;
  currentPage?: number;
}

interface NoticiasResponse {
  noticias: INoticias[];
  totalPages: number;
  currentPage: number;
}

// Hook personalizado para noticias
export const useNoticias = (page = 1): UseNoticiasResult => {
  const [noticias, setNoticias] = useState<INoticias[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchData(`news/client/${page}`);
        
        if (response.ok && response.data) {
          const data = response.data as NoticiasResponse;
          setNoticias(data.noticias || []);
          setTotalPages(data.totalPages || 0);
        } else {
          setError(response.message || 'Error al cargar noticias');
        }
      } catch (err) {
        setError('Error de conexión al cargar noticias');
        console.error('Error fetching noticias:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticias();
  }, [page]);

  return { 
    noticias, 
    loading, 
    error, 
    totalPages, 
    currentPage: page 
  };
};

// Hook para obtener las últimas noticias
export const useLatestNoticias = (): UseNoticiasResult => {
  const [noticias, setNoticias] = useState<INoticias[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestNoticias = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchData('news/last-three');
        
        if (response.ok && response.data) {
          setNoticias(response.data);
        } else {
          setError(response.message || 'Error al cargar últimas noticias');
        }
      } catch (err) {
        setError('Error de conexión al cargar últimas noticias');
        console.error('Error fetching latest noticias:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNoticias();
  }, []);

  return { noticias, loading, error };
};

// Hook para obtener una noticia específica
export const useNoticia = (id: number): { noticia: INoticias | null; loading: boolean; error: string | null } => {
  const [noticia, setNoticia] = useState<INoticias | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchNoticia = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchData(`news/${id}`);
        
        if (response.ok && response.data) {
          setNoticia(response.data);
        } else {
          setError(response.message || 'Error al cargar la noticia');
        }
      } catch (err) {
        setError('Error de conexión al cargar la noticia');
        console.error('Error fetching noticia:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticia();
  }, [id]);

  return { noticia, loading, error };
}; 