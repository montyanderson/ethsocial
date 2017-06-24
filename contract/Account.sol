pragma solidity ^0.4.10;

contract Account {
    struct Comment {
        address owner;
        string content;
        bool edited;
    }

    struct Post {
        string content;
        Comment[] comments;
        bool edited;
    }

    string name;
    string bio;
    Post[] posts;
    address owner;
    address[] follows;


    modifier isOwner() {
        require(owner == msg.sender);
        _;
    }

    function Account() {
        owner = msg.sender;
    }

    function setName(string _name) isOwner {
        name = _name;
    }

    function getName() returns (string) {
        return name;
    }

    function setBio(string _bio) isOwner {
        bio = _bio;
    }

    function getBio() returns (string) {
        return bio;
    }

    function pushPost(string content) isOwner {
        posts[posts.length++].content = content;
    }

    function getPosts() returns (uint) {
        return posts.length;
    }

    function getPost(uint id) returns (string, bool, uint) {
        var post = posts[id];

        return (post.content, post.edited, post.comments.length);
    }

    function editPost(uint id, string content) isOwner {
        var post = posts[id];

        post.content = content;
        post.edited = true;
    }

    function _pushComment(uint id, string content) external {
        var post = posts[id];
        var comment = post.comments[post.comments.length++];

        comment.owner = msg.sender;
        comment.content = content;
    }

    function _editComment(uint postId, uint commentId, string content) external {
        var comment = posts[postId].comments[commentId];

        if(comment.owner != msg.sender) {
            throw;
        }

        comment.edited = true;
        comment.content = content;
    }

    function getComment(uint postId, uint commentId) returns (address, string) {
        var comment = posts[postId].comments[commentId];

        return (comment.owner, comment.content);
    }

    function pushComment(address user, uint postId, string content) isOwner {
        Account(user)._pushComment(postId, content);
    }

    function editComment(address user, uint postId, uint commentId, string content) isOwner {
        Account(user)._editComment(postId, commentId, content);
    }

    function getFollows() returns (uint) {
        return follows.length;
    }

    function pushFollow(address account) isOwner {
        follows.push(account);
    }

    function deleteFollow(uint id) isOwner {
        follows[id] = address(0);
    }
}
