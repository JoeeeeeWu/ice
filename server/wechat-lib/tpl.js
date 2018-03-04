const compiled = (info) => {
  const {
    msgType,
    fromUserName,
    toUserName,
    createTime,
    content,
  } = info;
  const tpl = () => {
    switch (msgType) {
      case 'image':
        return `
          <Image>
            <MediaId>
              <![CDATA[${content.mediaId}]]>
            </MediaId>
          </Image>
        `;
      case 'voice':
        return `
          <Voice>
            <MediaId>
              <![CDATA[${content.mediaId}]]>
            </MediaId>
          </Voice>
        `;
      case 'video':
        return `
          <Video>
            <MediaId>
              <![CDATA[${content.mediaId}] ]>
            </MediaId>
            <Title>
              <![CDATA[${content.title}] ]>
            </Title>
            <Description>
              <![CDATA[${content.description}]]>
            </Description>
          </Video>
        `;
      case 'music':
        return `
          <Music>
            <Title>
              <![CDATA[${content.TITLE}]]>
            </Title>
            <Description>
              <![CDATA[${content.DESCRIPTION}]]>
            </Description>
            <MusicUrl>
              <![CDATA[${content.MUSIC_Url}]]>
            </MusicUrl>
            <HQMusicUrl>
              <![CDATA[${content.HQ_MUSIC_Url}]]>
            </HQMusicUrl>
            <ThumbMediaId>
              <![CDATA[${content.mediaId}]]>
            </ThumbMediaId>
          </Music>
        `;
      case 'news':
        return `
          <ArticleCount>
            ${content.length}
          </ArticleCount>
          <Articles>
            ${content.map(item => `
              <item>
                <Title>
                  <![CDATA[${item.title}]]>
                </Title>
                <Description>
                  <![CDATA[${item.description}]]>
                </Description>
                <PicUrl>
                  <![CDATA[${item.picUrl}]]>
                </PicUrl>
                <Url>
                  <![CDATA[${item.url}]]>
                </Url>
              </item>
            `).join('')}
          </Articles>
        `;
      default:
        return `
          <Content>
            <![CDATA[${content}]]>
          </Content>
        `;
    }
  };
  return `
    <xml>
      <ToUserName>
        <![CDATA[${fromUserName}]]>
      </ToUserName>
      <FromUserName>
        <![CDATA[${toUserName}]]>
      </FromUserName>
      <CreateTime>${createTime}</CreateTime>
      <MsgType>
        <![CDATA[${msgType}]]>
      </MsgType>
      ${tpl()}
    </xml>
  `;
};

export default compiled;
