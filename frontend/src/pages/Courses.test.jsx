import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Courses from './Courses';
import api from '../services/api';

jest.mock('../services/api');

describe('Courses Page', () => {
  beforeEach(() => {
    api.get.mockResolvedValue({ data: [
      { _id: '1', name: 'Teste', description: 'Desc' }
    ] });
  });

  it('lista cursos recebidos da API', async () => {
    render(<Courses />);
    expect(screen.getByText(/Carregando cursos…/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Teste')).toBeInTheDocument();
      expect(screen.getByText('Desc')).toBeInTheDocument();
    });
  });

  it('cria um novo curso via formulário', async () => {
    api.post.mockResolvedValue({ data: { _id: '2', name: 'Novo', description: '' }});
    render(<Courses />);

    fireEvent.change(screen.getByPlaceholderText(/Nome do curso/i), {
      target: { value: 'Novo' }
    });
    fireEvent.click(screen.getByText(/Criar Curso/i));

    await waitFor(() => {
      expect(screen.getByText('Novo')).toBeInTheDocument();
    });
  });
});
