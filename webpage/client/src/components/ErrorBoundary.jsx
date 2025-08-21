import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log en consola; acá podrías enviar a un servicio si querés
    console.error('Error capturado por ErrorBoundary:', error, info);
    this.setState({ info });
  }

  handleRetry = () => {
    // Resetea el estado y vuelve a intentar renderizar
    this.setState({ hasError: false, error: null, info: null });
  };

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env?.MODE !== 'production';
      return (
        <div style={{maxWidth: 820, margin: '4rem auto', padding: '1.5rem', border: '1px solid #eee', borderRadius: 12}}>
          <h1 style={{marginTop: 0}}>Ups, algo salió mal</h1>
          <p>Ocurrió un error al renderizar la aplicación.</p>
          <button onClick={this.handleRetry} style={{padding: '0.6rem 1rem', borderRadius: 8, border: '1px solid #ccc', cursor: 'pointer'}}>
            Reintentar
          </button>
          {isDev && (
            <details style={{marginTop: '1rem', whiteSpace: 'pre-wrap'}}>
              <summary>Detalles (solo dev)</summary>
              <div style={{marginTop: '0.5rem', color: '#b00020'}}>
                {String(this.state.error)}
              </div>
              {this.state.info?.componentStack && (
                <code>{this.state.info.componentStack}</code>
              )}
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
