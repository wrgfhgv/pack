import React, { useState } from 'react';

import { Flex, Text } from '@lego/lego_core';

interface ISwitchProps {
  /** switch渲染列表 */
  switchList: string[];

  /** index 改变时的回调 */
  OnIndexChange?: (index: number) => void;

  /** 默认index 不传默认为0 */
  defaultIndex?: number;

  /** pos值 埋点使用 */
  pos?: string | string[];
}

export function Switch({
  switchList,
  OnIndexChange,
  defaultIndex,
  pos,
}: ISwitchProps) {
  const [switchIndex, setSwitchIndex] = useState(defaultIndex || 0);

  function handleClick(index) {
    setSwitchIndex(index);
    OnIndexChange?.(index);
  }

  return (
    <Flex align="center" className="p-2 rounded-full bg-default">
      {switchList.map((item, index) => (
        <Text
          data-log-click={JSON.stringify({
            pos: Array.isArray(pos) ? pos[index] : pos,
          })}
          onClick={() => handleClick(index)}
          size="t3"
          weight={switchIndex === index ? 'medium' : undefined}
          color={switchIndex === index ? 'darker' : undefined}
          key={index}
          className={`px-12 py-4 rounded-full ${
            switchIndex === index ? 'bg-card' : ''
          }`}>
          {item}
        </Text>
      ))}
    </Flex>
  );
}
