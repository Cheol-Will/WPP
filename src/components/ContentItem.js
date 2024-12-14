// src/components/ContentItem.js

export default function ContentItem({ content }) {
    return (
      <div className="mb-2">
        <p>{content.value}</p>
      </div>
    );
  }
  