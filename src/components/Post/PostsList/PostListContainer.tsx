import * as React from "react";
import { PostContainer } from "../PostContainer";
import { Post } from "../../../Models/Post";
import { PostList } from "./PostList";
import { Paginator } from "./Paginator";
import { getThemeProps } from "@material-ui/styles";

interface IFetchPostsData {
    numberOfPosts: number;
    posts: Post[];
}

const fetchPosts = async (pageNumber = 1): Promise<IFetchPostsData> => {
    let response = await fetch("https://vppporgbhg.execute-api.us-east-1.amazonaws.com/Prod/PostsList/" + 1);
    let responseToJson = await response.json();

    if (response.status != 200)
        throw new Error('Not authorized');
    let tmpPosts: Post[] = [];
    //TODO: in responseOfJson there should be total number of all posts and posts. 
    for (let postData of responseToJson.Posts) {
        let newPost: Post = new Post();
        newPost.parseData(postData);
        tmpPosts.push(newPost);
    }
    let result: IFetchPostsData = {
        numberOfPosts: tmpPosts.length,//TODO
        posts: tmpPosts
    };
    return result;
}


export const PostListContainer: React.SFC = () => {
    const [posts, setPosts] = React.useState<Post[]>([]);
    const [numberOfPostsOnPage, setNumberOfPostsOnPage] = React.useState<number>(10);
    const [numberOfPosts, setNumberOfPosts] = React.useState<number>(0);
    const [loading, setLoading] = React.useState<boolean>(true);

    const pageNumberChange = async (pageNumber: number) => {
        setLoading(true);
        let data: IFetchPostsData = await fetchPosts(pageNumber);
        setPosts(data.posts);
        setNumberOfPosts(data.numberOfPosts);
    };

    React.useEffect(() => {
        if (posts.length > 0)
            return;
        (async function anyName() {
            await pageNumberChange(1)
        })();
    });

    return (
        <div className="row">
            <div className="col-md-3"></div>
            {numberOfPosts > 0 &&
                <div className="col-md-6">
                    <Paginator
                        onPageChange={pageNumberChange}
                        numberOfPostsPerPage={numberOfPostsOnPage}
                        numberOfPosts={numberOfPosts}
                    />
                    <PostList posts={posts} />
                </div>
            }
            <div className="col-md-3"></div>
        </div>
    );
}