// Encode newly generated frames whose sole visual reference is home-lin.png.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const sharp=require('sharp');
const root=path.resolve(__dirname,'../..');
const size=480,delays=[800,350,350,800,180,350,180,590,1400];
(async()=>{
  const original=path.join(root,'img/home-lin.png');
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(original)).digest('hex'),'79eee8cc3d055c1fd43c9568fea0bbf0e81142d9b17d1391e57709a124d83058');
  const source=path.join(__dirname,'spritesheet.png'),meta=await sharp(source).metadata(),frames=[];
  for(let frame=0;frame<9;frame++){
    const col=frame%3,row=Math.floor(frame/3),left=Math.round(col*meta.width/3),top=Math.round(row*meta.height/3);
    const width=Math.round((col+1)*meta.width/3)-left,height=Math.round((row+1)*meta.height/3)-top;
    // Use the complete, equally sized cells without altering body proportions.
    const data=await sharp(source).extract({left,top,width,height}).flatten({background:'#fff'})
      .resize(size,size).ensureAlpha().raw().toBuffer();
    for(let i=0;i<data.length;i+=4){
      const min=Math.min(data[i],data[i+1],data[i+2]),max=Math.max(data[i],data[i+1],data[i+2]);
      if(min>=245&&max-min<=2)data[i]=data[i+1]=data[i+2]=255;
    }
    frames.push(data);
  }
  const gif=path.join(root,'img/home-lin-entrance-original.gif'),poster=path.join(root,'img/home-lin-original-still.png');
  const start=path.join(root,'img/home-lin-original-start.png');
  await sharp(Buffer.concat(frames),{raw:{width:size,height:size*frames.length,channels:4,pageHeight:size}})
    .gif({loop:1,delay:delays,dither:.75,effort:7,reuse:false}).toFile(gif);
  await sharp(gif,{page:8}).png().toFile(poster);
  await sharp(gif,{page:0}).png().toFile(start);
  const m=await sharp(gif,{animated:true}).metadata();
  assert.equal(m.width,size);assert.equal(m.pageHeight,size);assert.equal(m.pages,9);assert.equal(m.loop,1);
  assert.equal(m.delay.reduce((a,b)=>a+b,0),5000);
  const final=await sharp(gif,{page:8}).ensureAlpha().raw().toBuffer();
  assert.equal(final.compare(await sharp(poster).ensureAlpha().raw().toBuffer()),0);
  for(let f=0;f<9;f++){
    const data=await sharp(gif,{page:f}).removeAlpha().raw().toBuffer();
    let longest=0,current=0,sideRows=0;
    for(let y=430;y<460;y++)for(let x=115;x<155;x++){
      const i=(y*size+x)*3;
      if(Math.max(data[i],data[i+1],data[i+2])<145){sideRows++;break;}
    }
    assert.ok(sideRows>=20,`frame ${f+1}: retain the torso side contour`);
    for(let y=420;y<480;y++){
      current=0;
      for(let x=80;x<460;x++){
        const i=(y*size+x)*3;
        current=Math.max(data[i],data[i+1],data[i+2])<145?current+1:0;
        longest=Math.max(longest,current);
      }
    }
    assert.ok(longest<25,`frame ${f+1}: no horizontal bottom closing stroke (${longest}px)`);
  }
  console.log(JSON.stringify({gif,start,poster,frames:9,plays:1,durationMs:5000,finalHoldMs:1400,posterMatchesTail:true,leftContour:true,openBottom:true,bytes:fs.statSync(gif).size}));
})().catch(error=>{console.error(error);process.exitCode=1;});
