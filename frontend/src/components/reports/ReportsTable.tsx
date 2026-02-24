const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('ro-RO', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
  };

  const getTypeLabel = (type: Report['type']) => {
    switch (type) {
      case 'note': return 'Note';
      case 'absente': return 'Absențe';
      case 'complet': return 'Complet';
    }
  };