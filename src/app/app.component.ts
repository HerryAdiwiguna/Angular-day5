import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { Patch } from './patch.model';
import { PostService } from './post.service';
import { Subscription } from 'rxjs';
import { error } from '@angular/compiler/src/util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts = [];
  showLoading = false;
  titleUpd: string;
  contentUpd: string;
  idUpd: string;

  errorSub: Subscription;

  constructor(private postService: PostService) {}
  ngOnDestroy(): void {
    this.errorSub.unsubscribe;
  }

  ngOnInit() {
    this.errorSub = this.postService.errorHandling.subscribe(
      error => {
        this.error = error;
      }
    )
    this.fetchPosts();
  }

  onCreatePost(postData: Post) {
    //send Http
    this.postService.createAndPost(postData);
  }

  onUpdatePost(patchData: Patch){
    console.log(patchData);
    const data = { [patchData.idUpd] : {
      title: patchData.titleUpd,
      content: patchData.contentUpd
    }};
    this.postService.updataData(data)
    .subscribe(
      (data) => {
        console.log(data);
        this.fetchPosts();
      }
      
    );

  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
    this.showLoading = true;
    this.postService.deletePosts().subscribe(
      (data) => {
        this.showLoading = false;
        this.fetchPosts();
      }
    )
  }

  getData(post: Post){
    console.log(post)
    this.idUpd = post.id;
    this.titleUpd  = post.title;
    this.contentUpd = post.content;
  }
  
  error = null;

  private fetchPosts(){
    this.showLoading = true;
    this.postService.fetchPost()
    .subscribe(
      posts => {
        // console.log(posts);
        this.showLoading = false;
        this.loadedPosts = posts;
      },
      error => {
        console.log(error);
        this.error = error;
      }
    );
  }
}
