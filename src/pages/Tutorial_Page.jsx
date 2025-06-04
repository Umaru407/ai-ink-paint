import React from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Text from '../components/Text';
import Button from '../components/Button';
import { usePageNavigation } from '../contexts/PageContext';

const TutorialPage = () => {
    const tutorials = [{
        image: '/tutorials/t1.png',
        title: '詩',
        intro: '詩詞承載情感與哲思，是中國文人藝術的靈魂。畫家常以詩為題，書法家以詩為書，詩與畫相互映照，達到「詩中有畫，畫中有詩」的境界。',
        description: '從系統推薦的詩詞庫中選擇詩句，這將作為系統幫你生成的水墨畫。'
    },
    {
        image: '/tutorials/t2.png',
        title: '書',
        intro: '書法不僅是文字的書寫，更是一種藝術表達。書法的筆觸與結構能影響整體畫面氛圍，無論是端正的楷書、流暢的行書，還是灑脫的草書，皆能展現創作者的個性與意境。',
        description: '在宣紙上寫上你想寫的詩詞文字，為畫作提詞'
    },
    {
        image: '/tutorials/t4.png',
        title: '畫',
        intro: '中國水墨畫講究意境與神韻，常以山水、花鳥、人物為主題，透過筆墨濃淡、線條變化與留白技法，創造出富有詩意的畫面。',
        description: '選擇你喜歡的畫作，為水墨畫上色，增添色彩'
    },
    {
        image: '/tutorials/t5.png',
        title: '印',
        intro: '印章是中國藝術創作的最後一筆，具有畫龍點睛的作用。篆刻藝術獨具風格，常以朱文（陽刻）或白文（陰刻）呈現，為作品增添個人特色與收藏價值。',
        description: '選擇你喜歡的印章，為水墨畫落款'
    },




    ];

    const { goToPage } = usePageNavigation();

    return (
        <div className='w-full h-full p-16'>
            <div className="relative">
                <Swiper
                    slidesPerView={1}
                    className='w-full h-full'
                    modules={[Navigation, Pagination]}
                    navigation={{
                        nextEl: '.swiper-button-next1',
                        prevEl: '.swiper-button-prev1',
                    }}
                    pagination={{
                        type: 'progressbar',
                        renderProgressbar: function (progressbarFillClass) {
                            return `<span class="rounded-large flex justify-end items-center ${progressbarFillClass}" style="background: #57534d; height: 22px">
                               
                            </span>`;
                        }
                    }}
                >


                    {tutorials.map((tutorial, index) => (
                        <SwiperSlide key={index} className='w-full h-full'>
                            <div className='w-full h-full'>

                                <Text type='title' className='mb-4 mt-12' >
                                    {tutorial.title}
                                </Text>

                                <Text type='subtitle' className='mb-4 ' >
                                    教學步驟 {index + 1}
                                </Text>

                                <Text type='heading' className='text-center'>
                                    {tutorial.description}
                                </Text>
                                {/* <Text type='heading' className='mb-4' >
                                    {tutorial.intro}
                                </Text> */}
 
                                <div className=' p-4 m-4 flex w-fit h-full justify-center bg-stone-600 rounded-lg'>

                                    <img
                                        src={tutorial.image}
                                        alt={`教學 ${index + 1}`}
                                        className='w-11/12 object-fill rounded-lg'
                                    />

                                     
                                </div>


{
                                    index === tutorials.length - 1 && (
                                        <Button className='mt-4 flex-grow' fullWidth onPress={() => goToPage(1)}>
                                            <Text type="heading">開始作品</Text>
                                        </Button>
                                    )
                                }



                               





                            </div>

                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* <div className='swiper-button-next1 absolute top-1/2 right-4 z-10 cursor-pointer w-6 h-6'>
                    111
                </div>
                <div className='swiper-button-prev1 absolute top-1/2 left-4 z-10 cursor-pointer w-6 h-6'>
                    222
                </div> */}
            </div>
        </div>
    );
};

export default TutorialPage;