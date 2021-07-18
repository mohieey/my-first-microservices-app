const CommentList = ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    let content;

    switch (comment.status) {
      case "pending":
        content = "waiting for approval";
        break;

      case "approved":
        content = comment.content;
        break;

      case "rejected":
        content = "rejected comment";
        break;

      default:
        break;
    }
    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
