import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { loadPostById, deleteComment } from '../../../actions/post';
import Loading from '../../modal/Loading';
import Post from './Post';
import PostForm from './PostForm';
import Confirm from '../../modal/Confirm';

const CommentPost = ({
	match,
	posts: { post, loading },
	loadPostById,
	deleteComment,
}) => {
	useEffect(() => {
		loadPostById(match.params.id);
	}, [loadPostById, match.params.id]);

	const [otherValues, setOtherValues] = useState({
		toggleModal: false,
		toDelete: '',
	});

	const { toggleModal, toDelete } = otherValues;

	const deletePostC = () => {
		deleteComment(post._id, toDelete);
	};

	const setToggle = (e, post_id) => {
		if (e) e.preventDefault();
		setOtherValues({
			toDelete: post_id ? post_id : '',
			toggleModal: !toggleModal,
		});
	};

	return loading || post === null ? (
		<Loading />
	) : (
		<div className='chat'>
			<Post showActions={false} isComment={false} post={post} />
			<Confirm
				toggleModal={toggleModal}
				setToggleModal={setToggle}
				confirm={deletePostC}
				text='¿Está seguro que desea eliminar la publicación?'
			/>
			<PostForm isPost={false} post_id={post._id} />

			<div className='posts'>
				{post.comments.map((comment) => (
					<Post
						key={comment._id}
						isComment={true}
						post={comment}
						showActions={false}
						setToggle={setToggle}
					/>
				))}
			</div>
		</div>
	);
};

CommentPost.propTypes = {
	posts: PropTypes.object.isRequired,
	loadPostById: PropTypes.func.isRequired,
	deleteComment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	posts: state.posts,
});

export default connect(mapStateToProps, { loadPostById, deleteComment })(
	withRouter(CommentPost)
);
