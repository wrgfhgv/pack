/* eslint-disable eslint-comments/disable-enable-pair */
import React, { useState } from 'react';
import {
  View,
  Header,
  Carousel,
  Flex,
  Text,
  Card,
  Container,
} from '@lego/lego_core';
import { Switch } from '..';

function WeatherTip({ tips, diff, log }) {
  const [switchIndex, setSwitchIndex] = useState(diff || 0);

  function sliceArrayAs(array, targetNumInItem) {
    const result = [] as any;
    for (let i = 0; i < array.length; i += targetNumInItem) {
      result.push(array.slice(i, i + targetNumInItem));
    }
    return result;
  }

  const renderList = sliceArrayAs(tips[switchIndex], 6);

  if (tips.length) {
    return (
      <Card {...log}>
        <Flex align="center" justify="between" className="mb-12">
          <Header size="h3">生活贴士</Header>

          <Switch
            switchList={['今天', '明天', '后天']}
            OnIndexChange={setSwitchIndex}
            defaultIndex={diff || 0}
            pos={['today', 'tomorrow', 'dat']}
          />
        </Flex>
        <Carousel>
          {renderList.map((item, i) => (
            <Container key={i} gutter={8} layout="1-1-1" className="mb-8">
              {item.map((subItem, subIndex) => {
                const { desc, Icon, info, url } = subItem;
                return (
                  <Flex
                    align="center"
                    justify="center"
                    key={String(subIndex) + i}
                    className="py-8 bg-light rounded-3 text-center">
                    <Flex
                      href={url}
                      data-log-click={JSON.stringify({
                        pos: desc.split('指数')[0],
                      })}>
                      <View>
                        {Boolean(Icon) && <Icon />}

                        <Text color="darker" size="t2">
                          {info}
                        </Text>
                        <Text size="t4" color="light">
                          {desc}
                        </Text>
                      </View>
                    </Flex>
                  </Flex>
                );
              })}
            </Container>
          ))}
        </Carousel>
      </Card>
    );
  }

  return null;
}

export { WeatherTip };
