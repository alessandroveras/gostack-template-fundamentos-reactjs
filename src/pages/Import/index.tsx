// libs
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { uniqueId } from 'lodash';
import filesize from 'filesize';

// components
import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

// app
import { Container, Title, ImportFileContainer, Footer } from './styles';
import api from '../../services/api';

// assets
import alert from '../../assets/alert.svg';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function submitFile(): Promise<void> {
    const data = new FormData();
    data.append('file', uploadedFiles[0].file, uploadedFiles[0].name);

    try {
      await api.post('/transactions/import', data);
      history.push('/');
    } catch (err) {
      console.log(err.response.error);
    }
  }

  function handleUpload(files: File[]): void {
    const newUploadedFiles = files.map(file => ({
      file,
      name: file.name,
      readableSize: filesize(file.size),
    }));
    setUploadedFiles(newUploadedFiles);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={handleUpload} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={submitFile} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
