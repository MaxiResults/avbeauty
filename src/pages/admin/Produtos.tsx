import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Produtos() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/admin/produtos/lista', { replace: true });
  }, [navigate]);

  return null;
}
