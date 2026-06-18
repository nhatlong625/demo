import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';

function UploadDocumentPage() {
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Upload"
        title="Add new study documents"
        description="Prepare files for summaries, AI tutoring, and quiz generation."
      />
      <section className="split-panel">
        <Card title="Document details" description="These fields are UI-only and ready for backend wiring later.">
          <div className="section-stack">
            <Input label="Title" placeholder="Neural Networks Revision Pack" />
            <Input label="Course" placeholder="Machine Learning Foundations" />
            <Input label="Description" as="textarea" placeholder="Add a short summary of the material" />
            <Button>Upload document</Button>
          </div>
        </Card>
        <Card title="Drop zone" description="Mock upload interface">
          <div className="upload-zone">
            <div className="empty-illustration">UP</div>
            <h3 className="card-title">Drag and drop files here</h3>
            <p className="card-description">Supports notes, PDFs, slide decks, and study summaries.</p>
            <Button variant="secondary">Choose files</Button>
          </div>
        </Card>
      </section>
    </div>
  );
}

export default UploadDocumentPage;
