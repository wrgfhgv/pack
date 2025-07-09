import React from 'react';
import { FeelgoodTemplate } from '@lego/search_feelgood';
import { getSearch } from '@Utils';

function Survey(props) {
  const { extraData, data } = props;
  const { id_str } = data;
  const { searchId, keyword } = extraData;
  const { device_id } = getSearch();

  return (
    <FeelgoodTemplate
      taskId="7035914658334654500"
      uniqueId={id_str}
      event="NewWeatherUITrigger"
      userInfo={{
        user_id: String(device_id) || '0',
        search_id: searchId,
        query: keyword,
      }}
      type="integrated"
      mode="stay"
      containerStyle={{
        display: 'none',
        borderRadius: '16px',
        border: '0 solid',
        margin: '8px',
        padding: '20px',
        backgroundColor: '#fff',
      }}
    />
  );
}

export { Survey };
