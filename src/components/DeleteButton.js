import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { Button, Confirm, Icon, Popup } from "semantic-ui-react";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function DeleteButton({ postId, commentId, onNavigate }){
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrComment] = useMutation(mutation, {
    update(proxy){
      setConfirmOpen(false);

      if(!commentId){
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY
        });
  
        proxy.writeQuery({ 
          query: FETCH_POSTS_QUERY, 
          data: {
            getPosts: data.getPosts.filter(post => post.id !== postId)
          }
        });
      }

      if(onNavigate){
        onNavigate('/');
      }
    },
    variables: {
      postId,
      commentId
    }
  });

  return (
    <>
      <Popup 
        content={`Delete ${commentId? 'comment' : 'post'}`}
        inverted
        trigger={
          <Button 
            as='div' 
            color='red' 
            floated='right'
            onClick={() => setConfirmOpen(true)}
          >
            <Icon name='trash' style={{ margin: 0 }}/>
          </Button>
        }
      />
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrComment}
      />
    </>
  )
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!){
    deletePost(postId: $postId)
  }
`
const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!){
    deleteComment(postId: $postId, commentId: $commentId){
      id
      comments{
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`

export default DeleteButton;